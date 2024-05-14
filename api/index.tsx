import { Button, FrameIntent, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/hubs'
import { neynar as neynarMW } from 'frog/middlewares'
import { handle } from 'frog/vercel'
import { ButtonName, TState, Topic, TopicState } from './types.js'
import { topics } from './topic-data.js'
import { saveTopiCast } from './db.js'

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog<{ State: TState }>({
  assetsPath: '/',
  basePath: '/api',
  initialState: {
    frame: 1
  },
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
  verify: 'silent'
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use(
  neynarMW({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  }));

app.frame("/:topicName", async (c) => {
  const topicName = c.req.param("topicName");
  const topic = topics[topicName];
  const buttonValue = c.buttonValue as ButtonName;
  let ansFromPrevFrame = ((c.inputText as string) || "").trim();
  ansFromPrevFrame = ansFromPrevFrame.split(",").map(s => s.trim()).join(",");  //  Clears spaces

  let previousFrame = 0;
  const state = c.deriveState((previousState: TState) => {
    previousFrame = previousState.frame;
    switch (buttonValue) {
      case ButtonName.Next:
      case ButtonName.Resume:
      case ButtonName.Finish:
        previousState.frame++;
        break;

      case ButtonName.Prev:
        previousState.frame--;
        break;
    }
  });

  const updatedState: TopicState = {
    fid: c.frameData?.fid as number,
    castId: c.frameData?.castId.fid as number,
    topicName,
    requesterCustodyAddress: (c.var as any)?.interactor?.custodyAddress,
    userName: (c.var as any)?.interactor?.username,
    startDateTime: new Date(),
    status: 'Started',
  }

  if (ansFromPrevFrame && ansFromPrevFrame.length > 0 &&
    buttonValue == ButtonName.Next ||
    buttonValue == ButtonName.Check ||
    buttonValue == ButtonName.Finish) {
    updatedState.itemResponse = {
      [previousFrame]: ansFromPrevFrame
    }
  }

  if (buttonValue == ButtonName.Finish) {
    updatedState.status = "Completed";
    updatedState.endDateTime = new Date();
  }

  if (buttonValue != ButtonName.Resume) {
    await saveTopiCast(topic, updatedState);
  }

  return c.res({
    image: buildImage(topic, state, buttonValue, ansFromPrevFrame),
    intents: [
      ...buildPrompt(topic, state, buttonValue),
      ...buildButtons(topic, state, buttonValue),
    ],
  })
})

function buildImage(topic: Topic, state: TState, buttonValue: ButtonName, ansFromPrevFrame: string) {
  if (!topic) {
    return <div style={{ color: 'orange', fontSize: 60, margin: 'auto' }}>
      Invalid Topic !
    </div>;
  }

  if (buttonValue == ButtonName.Check) {
    const correctAns = topic.items[state.frame - 1].prompt?.correctAnswers?.join(",");
    if (correctAns == ansFromPrevFrame) {
      return <div style={{ display: 'flex', color: 'green', fontSize: 60, margin: 'auto' }}>
        Correct Answer - {correctAns}
      </div>;
    } else {
      return <div style={{ display: 'flex', color: 'orange', fontSize: 60, margin: 'auto' }}>
        Incorrect. The answer is - {correctAns}
      </div>;
    }
  } else {
    return `/${topic.name}/${state.frame}.png?${Date.now()}`;
  }
}

function buildButtons(topic: Topic, state: TState, buttonValue: ButtonName) {
  if (!topic) {
    return [];
  }

  let buttons: FrameIntent[] = [];
  const linkUrl = topic.items[state.frame - 1].moreInfo;
  const prevButton = <Button value={`${ButtonName.Prev}`}>Prev</Button>
  const nextButton = <Button value={`${ButtonName.Next}`}>Next</Button>
  const linkButton = <Button.Link href={`${linkUrl}`}>More Info</Button.Link>
  const checkAnswerButton = <Button value={`${ButtonName.Check}`}>Check Answer</Button>
  const resumeButton = <Button value={`${ButtonName.Resume}`}>Resume</Button>
  const finishButton = <Button value={`${ButtonName.Finish}`}>Finish</Button>

  const isFirstFrame = state.frame == 1;
  const isFramesInBetween = state.frame > 1 && state.frame < topic.items.length - 1
  const isSecondToLastFrame = state.frame == topic.items.length - 1;
  const isLastFrame = state.frame == topic.items.length;

  if (buttonValue == ButtonName.Check) {
    buttons = [resumeButton];
  } else if (isFirstFrame) {
    buttons = [nextButton];
  } else if (isFramesInBetween) {
    buttons = [prevButton, nextButton];
  } else if (isSecondToLastFrame) {
    buttons = [prevButton, finishButton];
  } else if (isLastFrame) {
    //  No buttons for Last Frame
  }

  if (buttonValue != ButtonName.Check && topic.items[state.frame - 1].prompt && topic.items[state.frame - 1].prompt?.allowCheckAnswer) {
    buttons.push(checkAnswerButton);
  }

  if (topic.items[state.frame - 1].moreInfo) {
    buttons.push(linkButton);
  }
  return buttons;
}

function buildPrompt(topic: Topic, state: TState, buttonValue: ButtonName) {

  let textInput: FrameIntent[] = [];
  let placeHolder = "";

  const prompt = topic.items[state.frame - 1].prompt;
  if (topic && buttonValue != ButtonName.Check && prompt) {
    if (prompt.prompt) {
      if (prompt.correctAnswers && prompt.correctAnswers.length == 1) {
        placeHolder = `Select one: ${prompt.prompt}`;
      } else if (prompt.correctAnswers && prompt.correctAnswers.length > 1) {
        placeHolder = `${prompt.prompt} [comma sep]`;
      } else {
        placeHolder = `${prompt.prompt}`;
      }
    } else {
      placeHolder = "Questions or feedback ?";
    }
    textInput.push(<TextInput placeholder={`${placeHolder}`} />)
  }
  return textInput;
}
// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
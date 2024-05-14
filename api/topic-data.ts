import { Topics } from "./types.js";

export const topics: Topics = {
  "snapCustomUI": {
    name: "snapCustomUI",
    releaseDate: new Date(),
    lastUpdated: new Date(),
    imageAspectRatio: "1.91:1",
    items: [
      {
        id: 1,
        itemNote: "Intro Info",
        imageUrl: "1.png",
      },
      {
        id: 2,
        itemNote: "Overview",
        imageUrl: "2.png",
        prompt: {},
      },
      {
        id: 3,
        itemNote: "UI Components",
        imageUrl: "3.png",
        prompt: {},
      }
      ,
      {
        id: 4,
        itemNote: "Address Component",
        imageUrl: "4.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/features/custom-ui/#address"
      },
      {
        id: 5,
        itemNote: "Address Code view",
        imageUrl: "5.png",
        prompt: {},
      },
      {
        id: 6,
        itemNote: "Yes/No Quiz",
        imageUrl: "6.png",
        prompt: {
          prompt: "A or B",
          correctAnswers: ["A"],
          allowCheckAnswer: true,
        }
      },
      {
        id: 7,
        itemNote: "MultiChoice Q",
        imageUrl: "7.png",
        prompt: {
          prompt: "A, B, C or D",
          correctAnswers: ["A", "B", "D"],
          allowCheckAnswer: true,
        }
      },
      {
        id: 8,
        itemNote: "References",
        imageUrl: "8.png"
      },
      {
        id: 9,
        itemNote: "Wallet Address",
        imageUrl: "9.png",
        prompt: {
          prompt: "Wallet Address",
        }
      },
      {
        id: 10,
        itemNote: "Thank You",
        imageUrl: "10.png"
      }
    ]
  }
}
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
        itemNote: "Overview on Snaps",
        imageUrl: "2.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/"
      },
      {
        id: 3,
        itemNote: "Overview on Custom UI",
        imageUrl: "3.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/features/custom-ui/interactive-ui/"
      },
      {
        id: 4,
        itemNote: "UI Components",
        imageUrl: "4.png",
        prompt: {},
      }
      ,
      {
        id: 5,
        itemNote: "Address Component",
        imageUrl: "5.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/features/custom-ui/#address"
      },
      {
        id: 6,
        itemNote: "Address Code view",
        imageUrl: "6.png",
        prompt: {},
      },
      {
        id: 7,
        itemNote: "Button Component",
        imageUrl: "7.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/features/custom-ui/#button"
      },
      {
        id: 8,
        itemNote: "Button Code view",
        imageUrl: "8.png",
        prompt: {},
      },
      {
        id: 9,
        itemNote: "Other UI Components",
        imageUrl: "9.png",
        prompt: {},
        moreInfo: "https://docs.metamask.io/snaps/features/custom-ui/"
      },
      {
        id: 10,
        itemNote: "Quick Quiz: Yes/No",
        imageUrl: "10.png",
        prompt: {
          prompt: "A or B",
          correctAnswers: ["A"],
          allowCheckAnswer: true,
        }
      },
      {
        id: 11,
        itemNote: "MultiChoice Q",
        imageUrl: "11.png",
        prompt: {
          prompt: "A, B, C or D",
          correctAnswers: ["A", "B", "D"],
          allowCheckAnswer: true,
        }
      },
      {
        id: 12,
        itemNote: "Resources",
        imageUrl: "12.png"
      },
      {
        id: 13,
        itemNote: "Email Address",
        imageUrl: "13.png",
        prompt: {
          prompt: "Email Id",
        }
      },
      {
        id: 14,
        itemNote: "Mint POAP",
        imageUrl: "14.png",
        prompt: {
          prompt: "Wallet Address",
        }
      },
      {
        id: 15,
        itemNote: "Thank You",
        imageUrl: "15.png"
      }
    ]
  }
}
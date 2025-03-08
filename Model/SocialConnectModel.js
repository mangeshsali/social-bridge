const { default: mongoose } = require("mongoose");

const SocialConnectModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    githubURL: {
      type: String,
    },
    githubUser: {
      type: String,
    },
    githubContribution: {
      type: String,
    },
    repoData: [
      {
        repoName: {
          type: String,
        },
        repoLink: {
          type: String,
        },
        repoUpdated: {
          type: Date,
        },
        repoLanguage: {
          tyep: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("socialconnect", SocialConnectModel);

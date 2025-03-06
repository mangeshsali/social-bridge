const { default: mongoose } = require("mongoose");

const ProjectModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      trim: true,
    },
    projectName: {
      type: "String",
      required: true,
      trim: true,
    },
    projectHeadline: {
      type: "String",
      required: true,
      maxLength: 20,
      trim: true,
    },
    projectDescription: {
      type: "String",
      required: true,
      trim: true,
    },
    projectStack: {
      type: "String",
      required: true,
      trim: true,
    },
    projectLink: {
      type: "String",
      trim: true,
    },
    projectGithub: {
      type: "String",
      trim: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("project", ProjectModel);

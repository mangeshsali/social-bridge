const { query } = require("express");
const ProjectModel = require("../Model/ProjectModel");
const UserModel = require("../Model/UserModel");

const ProjectCreate = async (req, res) => {
  try {
    const {
      projectGithub,
      projectLink,
      projectDescription,
      projectHeadline,
      projectName,
      projectStack,
    } = req.body;
    const { _id } = req.user;

    const FindUser = await UserModel.findOne({ _id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const UserData = {
      userId: _id,
      projectName,
      projectHeadline,
      projectDescription,
      projectLink,
      projectGithub,
      projectStack,
    };

    const Project = new ProjectModel(UserData);
    await Project.save();
    res.status(200).send({ message: "Project Successfully Created" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log("error in Project", error.message);
  }
};

const ProjectList = async (req, res) => {
  try {
    const { _id } = req.user;

    const FindUser = await UserModel.findOne({ _id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const FindList = await ProjectModel.find({ userId: _id });

    if (FindList.length === 0) {
      return res.status(200).send({ message: "No Project Found" });
    }
    res.status(200).send(FindList);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
};

const ProjectDelete = async (req, res) => {
  const { id } = req.params;

  const FindId = await ProjectModel.findOne({ _id: id });

  if (!FindId) {
    return res.status(400).send({ message: "Project Not Found" });
  }

  const DeletProject = await ProjectModel.findByIdAndDelete(
    { _id: id },
    { new: true }
  );

  res.status(200).send(`${DeletProject.projectName} Deleted SuccessFully`);
  try {
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
};

const ProjectUpdate = async (req, res) => {
  try {
    const {
      projectGithub,
      projectLink,
      projectDescription,
      projectHeadline,
      projectName,
      projectStack,
    } = req.body;

    const { id } = req.params;

    const FindUserId = await ProjectModel.findOne({ _id: id });

    if (!FindUserId) {
      return res.status(400).send({ message: "Project Not Found" });
    }

    const { _id } = req.user;

    const UserData = {
      userId: _id,
      projectName,
      projectHeadline,
      projectDescription,
      projectLink,
      projectGithub,
      projectStack,
    };

    const FindUser = await ProjectModel.findByIdAndUpdate(
      { _id: id },
      { $set: UserData },
      { new: true }
    );
    res.status(200).send(FindUser);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error.message);
  }
};

module.exports = { ProjectCreate, ProjectList, ProjectDelete, ProjectUpdate };

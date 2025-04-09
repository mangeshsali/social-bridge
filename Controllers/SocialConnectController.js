const SocialConnectModel = require("../Model/SocialConnectModel");
const UserModel = require("../Model/UserModel");
const GithubRepoData = require("../Utils/GithubRepoData");

const GithubCreate = async (req, res) => {
  try {
    const { githubLink } = req.body;

    const { _id } = req.user;

    const FindUser = await UserModel.findById({ _id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const GithubUser = githubLink.split("/").at(-1);
    const GithubData = await GithubRepoData(GithubUser);

    if (GithubData.status === "404" || GithubData.length === 0) {
      return res.status(400).send({
        message: "Please Enter Valid User Name",
      });
    }

    const GithubRepo = GithubData.map((repo) => {
      return {
        repoName: repo.name,
        repoLink: repo.html_url,
        repoLanguage: repo.language,
        repoUpdated: repo.updated_at,
      };
    });

    const GithubUserData = {
      userId: _id,
      githubURL: GithubData[0].owner.html_url,
      githubUser: GithubData[0].owner.login,
      githubContribution: `https://ghchart.rshah.org/${GithubData[0].owner.login}`,
      repoData: GithubRepo,
    };

    const FindUserEntry = await SocialConnectModel.findOneAndUpdate(
      { userId: _id },
      { $set: GithubUserData }
    );

    if (!FindUserEntry) {
      const Github = new SocialConnectModel(GithubUserData);

      await Github.save();
    }

    res
      .status(200)
      .send({ message: "Successfully created", Repo: GithubUserData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const GithubDelete = async (req, res) => {
  try {
    const { _id } = req.user;

    const FindUser = await UserModel.findById({ _id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const FindRepo = await SocialConnectModel.findOneAndDelete({ userId: _id });
    if (!FindRepo) {
      return res
        .status(400)
        .send({ message: "Github Account Not Found Please Link Account" });
    }

    res.status(200).send({ messsage: "Github Repo deletd Sucessfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      messsage: error.message,
    });
  }
};

const GithubData = async (req, res) => {
  try {
    const { _id } = req.user;

    const FindUser = await UserModel.findById(_id);
    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }
    const FindGithub = await SocialConnectModel.findOne({ userId: _id });

    if (!FindGithub) {
      return res.status(200).send({ message: "Please Connect Github First" });
    }

    const GithubUser = FindGithub.githubUser;
    const GithubData = await GithubRepoData(GithubUser);

    const GithubRepo = GithubData.map((repo) => {
      return {
        repoName: repo.name,
        repoLink: repo.html_url,
        repoLanguage: repo.language,
        repoUpdated: repo.updated_at,
      };
    });

    const GithubUserData = {
      userId: _id,
      githubURL: GithubData[0]?.owner?.html_url,
      githubUser: GithubData[0]?.owner?.login,
      githubContribution: `https://ghchart.rshah.org/${GithubData[0]?.owner?.login}`,
      repoData: GithubRepo,
    };

    const FindUserEntry = await SocialConnectModel.findOneAndUpdate(
      { userId: _id },
      { $set: GithubUserData },
      { new: true }
    );

    res.status(201).send(FindUserEntry);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = { GithubCreate, GithubDelete, GithubData };

const GithubRepoData = async (user) => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=4&sort=updated&direction=desc`
    );

    const data = res.json();
    return data;
  } catch (error) {
    console.log("error in GihubData", error.message);
  }
};

module.exports = GithubRepoData;

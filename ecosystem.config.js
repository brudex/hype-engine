module.exports = {
    apps : [{
      name: "HypeEngine",
      script: "./bin/www",
      env: {
        NODE_ENV: "production",
        PORT: 3053,
        APP_NAME: "HypeEngine",
      }
    },{
      name: "HypeEngine Job Server",
      script: "./bin/job-www",
      env: {
        NODE_ENV: "production",
        PORT: 3054,
        APP_NAME: "JobServer",
      }
    }]
};

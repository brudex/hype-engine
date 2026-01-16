module.exports = {
    apps : [{
      name: "HypeEngine",
      script: "./bin/www",
      env: {
        NODE_ENV: "production",
        PORT: 3045,
      }
    },{
      name: "HypeEngine Job Server",
      script: "./bin/job-www",
      env: {
        NODE_ENV: "production",
        PORT: 3046,
      }
    }]
};

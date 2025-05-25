module.exports = {
  apps: [
    {
      name: "portfolio-tracker",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 8000,
        HOST: "0.0.0.0",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000,
        HOST: "0.0.0.0",
      },

      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      watch: false,
      ignore_watch: ["node_modules", "logs"],
      max_memory_restart: "1G",

      min_uptime: "10s",
      max_restarts: 10,
      autorestart: true,

      env_file: ".env",
    },
  ],
};

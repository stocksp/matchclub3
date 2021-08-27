/**
 * @type {import('next').NextConfig}
 */
 const cp = require('child_process');
 const gitSha = cp.execSync('git rev-parse --short HEAD', {
   cwd: __dirname,
   encoding: 'utf8'
 })
 const nextConfig = {
    env: {
        buildId: gitSha,
      },
  }
  
  module.exports = nextConfig
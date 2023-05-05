// const appEnvironment = String(process.env.APP_ENV).toLowerCase()
function getServerConfiguration() {
  return {
    APIDomain: 'http://localhost:8080',
  }
}
const serverConfig = getServerConfiguration()

export default { serverConfig }

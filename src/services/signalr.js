import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

export function createConnection(token) {
  const hubUrl = `${import.meta.env.VITE_API_URL }/hubs/telemetry`
  return new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build()
}

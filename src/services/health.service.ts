export default class HealthService {
  constructor() {}

  public async getSystemHealth(): Promise<any> {
    return {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: 'OK',
    };
  }
}

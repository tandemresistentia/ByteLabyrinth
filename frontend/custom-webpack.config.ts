import * as webpack from 'webpack';
import * as dotenv from 'dotenv';

export default {
  plugins: [
    new webpack.DefinePlugin({
      'globalThis.process.env': JSON.stringify({
        ...process.env,
        ...dotenv.config().parsed
      })
    })
  ],
  // Add stats configuration to reduce logging
  stats: {
    modules: false,
    warnings: false,
    colors: true,
    logging: 'none'
  },
  // Reduce infrastructure logging
  infrastructureLogging: {
    level: 'none'
  }
} as webpack.Configuration;
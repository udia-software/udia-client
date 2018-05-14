// @flow
import { Moment, utc, duration } from 'moment';

export default class Crypto {
  /**
   * Return `${years} years, ${months}, months, ${days} days, ${hours}:${minutes} ${seconds}s`
   * @param {Moment} startTime When to begin duration calculation
   * @param {*} withSuffix
   */
  static exactHumanizedTimeFrom(startTime: Moment) {
    const dateDuration = duration(utc().diff(startTime));
    let durationString = '';
    const years = dateDuration.get('years');
    if (years > 0) {
      durationString += `${years} years, `;
    }
    const months = dateDuration.get('months');
    if (months > 0) {
      durationString += `${months} months, `;
    }
    const days = dateDuration.get('days');
    if (days > 0) {
      durationString += `${days} days, `;
    }
    const hours = dateDuration.get('hours');
    if (hours > 0) {
      durationString += `${hours} hours, `;
    }
    const minutes = dateDuration.get('minutes');
    if (minutes > 0) {
      durationString += `${`0${minutes}`.slice(-2)} minutes, `;
    }
    const seconds = dateDuration.get('seconds');
    durationString += `${`0${seconds}`.slice(-2)} seconds`;
    return durationString;
  }
}

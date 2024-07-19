export default {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    },
    longNoWeekday: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    timeOnly: {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    },
    yearOnly: {
      year: 'numeric'
    },
  },
  it: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    },
    longNoWeekday: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    timeOnly: {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    },
    yearOnly: {
      year: 'numeric'
    }
  }
}
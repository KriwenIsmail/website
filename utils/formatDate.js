const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nob',
  'Dec'
]

const formatDate = date => {
  const DATE = date.split('T')[0]
  const YEAR = date.split('-')[0]
  const DAY = date.split('-')[2].split('T')[0]
  const MONTH = months[parseInt(DATE.split('-')[1].split('0')[1]) - 1]
  const TIME = date.split('T')[1].split('.')[0]
  const HOURS = TIME.split(':')[0]
  const MINUTES = TIME.split(':')[1]
  return {
    YEAR,
    MONTH,
    DAY,
    HOURS,
    MINUTES
  }
}

export default formatDate
var ctx = document.getElementById('myChart').getContext('2d')
var earning = document.getElementById('earning').getContext('2d')
var myChart = new Chart(ctx, {
  type: 'polarArea',
  data: {
    labels: ['logical', 'verbal', 'memory'],
    datasets: [
      {
        label: '# of Votes',
        data: [1200, 1900, 3000],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
})

var myChart = new Chart(earning, {
  type: 'bar',
  data: {
    labels: ['1', '2', '3', '4'],
    datasets: [
      {
        label: '# of overallskill',
        data: [1200, 1900, 3000, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 106, 86, 1)',
        ],
      },
    ],
  },
  options: {
    responsive: true,
  },
})

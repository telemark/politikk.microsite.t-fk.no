'use strict'

const Wreck = require('wreck')
const sortName = require('../lib/sort-name')
const config = require('../config')
const pkg = require('../package.json')
const wreckOptions = {
  json: true
}

module.exports.showFrontpage = (request, reply) => {
  const jobsTodo = 3
  var jobsDone = 0
  var viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }

  function allAboard () {
    jobsDone++
    if (jobsDone === jobsTodo) {
      reply.view('index', viewOptions)
    }
  }

  Wreck.get(config.OPENGOV_MEETINGS_API_URL + '/meetings/next?limit=5', wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      viewOptions.meetings = payload
    }
    allAboard()
  })

  Wreck.get(config.OPENGOV_POLITICIANS_API_URL + '/parties', wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      payload.sort(sortName)
      viewOptions.parties = payload
    }
    allAboard()
  })

  Wreck.get(config.OPENGOV_POLITICIANS_API_URL + '/committees', wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      payload.sort(sortName)
      viewOptions.committees = payload
    }
    allAboard()
  })
}

module.exports.showCalendar = (request, reply) => {
  const boardId = request.query.boardId
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }

  var meetingsUrl = `${config.OPENGOV_MEETINGS_API_URL}/meetings/next?limit=40`

  if (boardId) {
    meetingsUrl = `${meetingsUrl}&boardId=${boardId}`
  }

  Wreck.get(meetingsUrl, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      viewOptions.meetings = payload
      reply.view('kalender', viewOptions)
    }
  })
}

module.exports.showContact = (request, reply) => {
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    contacts: require('../config/contacts.json')
  }
  reply.view('kontakt', viewOptions)
}

module.exports.showLegal = (request, reply) => {
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }
  reply.view('personvern', viewOptions)
}

module.exports.showAgenda = (request, reply) => {
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }
  Wreck.get(config.OPENGOV_MEETINGS_API_URL + '/meetings/' + request.params.meetingId, wreckOptions, function (error, res, payload) {
    if (error) {
      reply(error)
    } else {
      viewOptions.meeting = payload[0]
      reply.view('agenda', viewOptions)
    }
  })
}

module.exports.showPolitician = (request, reply) => {
  const viewOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url
  }
  const politicianUrl = `${config.OPENGOV_POLITICIANS_API_URL}/politicians/${request.params.politikerId}`
  Wreck.get(politicianUrl, wreckOptions, (error, res, payload) => {
    if (error) {
      reply(error)
    } else {
      viewOptions.politicians = payload
      reply.view('politiker', viewOptions)
    }
  })
}

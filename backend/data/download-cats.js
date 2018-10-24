import axios from 'axios'
import fs from 'fs'
import { prop } from 'ramda'
import { from, range } from 'rxjs'
import { map, mergeMap, reduce } from 'rxjs/operators'

const http = axios.create()

const request$ = range(0, 5000).pipe(
  map(() => ({
    url: 'https://api.thecatapi.com/v1/images/search?format=json',
    method:
      'get',
    headers:
      {
        'Content-Type':
          'application/json',
        'x-api-key':
          '17d94b92-754f-46eb-99a0-65be65b5d18f'
      }
  })))

request$.pipe(
  mergeMap(r => from(http(r).then(prop('data'))),
    (_, x) => x, 20
  ),
  reduce((acc, c) => (acc.push(c), acc), [])
).subscribe(cats => {
  fs.writeFile('./cats.json', JSON.stringify(cats), () => {
    console.log('done')
  })
})


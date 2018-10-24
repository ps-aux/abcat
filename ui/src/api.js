const api = ({http}) => {

  console.log('creating http client', http)
  return {

    parse: () => {
      http.get('/car/parse')
    },
    convert: () => {
      http.get('/car/convert')
    }

  }

}

export default (...args) => api(...args)

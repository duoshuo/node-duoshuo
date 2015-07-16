export default function({ short_name }) {
  return {
    get: {
      qs: {
        short_name
      }
    },
    post: {
      form: {
        short_name
      }
    }
  }
}

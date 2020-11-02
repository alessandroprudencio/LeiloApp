export default (value) => {
  const re = /^([\d]{2})\.*([\d]{3})-*([\d]{3})/ // Pode usar ? no lugar do *
  return value.replace(re, '$1.$2-$3')
}

export const getTeams = () => {
  if (document.body.querySelectorAll(".rt-joomla-table").length === 0) return null
  return [document.body.querySelectorAll(".rt-joomla-table")[1]!, document.body.querySelectorAll(".rt-joomla-table")[3]!]
}
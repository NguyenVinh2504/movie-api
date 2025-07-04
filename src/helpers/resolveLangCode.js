import langs from 'langs'

function resolveLangCode(label) {
  // Tìm theo tên bản địa (local/native name) hoặc tên tiếng Anh (name)
  let lang = langs.where('local', label) || langs.where('name', label)

  // Nếu vẫn không tìm thấy, bạn có thể mặc định hoặc trả về null để xử lý sau
  return lang ? lang['1'] : null // ['1'] là ISO 639-1
}
export default resolveLangCode

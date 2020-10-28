/*
 * @Date: 2020-10-22 10:04:48
 * @LastEditors: 小枫
 * @description: 重写Message,解决同时弹出多个message的问题
 * @LastEditTime: 2020-10-22 10:08:40
 * @FilePath: \book\src\plugins\resetMessage.js
 */
import {
  Message
} from 'element-ui';
let messageInstance = null;
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
  ;['error', 'success', 'info', 'warning'].forEach(type => {
    resetMessage[type] = options => {
      if (typeof options === 'string') {
        options = {
          message: options
        }
      }
      options.type = type
      return resetMessage(options)
    }
  })
export const message = resetMessage
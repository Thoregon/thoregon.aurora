/**
 *
 * takes care of transaction strategy:
 * - immed      ... all changes will be synced immediately
 * - commit     ... changes will only be synced at commit (e.g. user clicks ok)
 *
 * edit indicators
 * - indicator if another user(s) is/are editing the same underlying model
 * - indicator on input filed where the other user(s) may modify (has focus)
 *
 * modification indicators
 * - if a property value has been changed from another user
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export default class Sync {

}

/**\
 * سيتولى نظام سلا backend عملية حقن Twilight في صفحات الثيم الخاصة بك.
 * هذا الملف مخصص فقط لأغراض IDE، ولا ينبغي أن يكون في مخرجات حزمة webpack.
 *
 * 🚨 تضمين هذا الملف في حزمة قد يتسبب في مشاكل غير متوقعة.
 *
 * إذا كنت تستخدم webpack، تأكد من إضافة قواعد الاستبعاد في webpack.config.js.
 *
 * {
 *     test: /\.js$/,
 *     exclude: [
 *         .... 
 *         asset('js/twilight.js')
 *         .... 
 *     ]
 * };
 *
 */
import {applyPolyfills, defineCustomElements as SallaWebComponents} from '@salla.sa/twilight-components/loader';

applyPolyfills().then(() => {
    SallaWebComponents(window);
});
import { createI18n } from "vue-i18n";

import { en } from '@/locals/en'
import { zhCn } from '@/locals/zh-cn'

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
        en: en,
        zhCn: zhCn
    }
})
export default i18n;
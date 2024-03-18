<!--
 * @Author: Chen Ray
 * @Date: 2024-03-10 18:47:20
 * @LastEditTime: 2024-03-12 01:35:35
 * @FilePath: \ranking-front-end\src\App.vue
 * @Description: Do not edit
   import {RouterLink, RouterView} from 'vue-router'
   import HelloWorld from './components/HelloWorld.vue'
-->
<script setup lang="ts">

import {ref, computed, onMounted, reactive, watch, type Ref} from 'vue'
import { Modal } from 'bootstrap'

import {index as rankingIndex, getPublicationIds, getBreakdowns, getWeeks} from './api/ranking'
import  { IRanking } from "@/model/baseModel"
import type { IBreakdown, IWeek } from "@/model/baseModel"

import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n();

const loading = ref(false)
const publicationId = ref('0')
const publicationIds = ref({})

const _ranking = new IRanking()

let rankings = ref(_ranking )

const _breakdown:IBreakdown[]  = []
let breakdowns = ref(_breakdown)


const _week:IWeek[]  = []
let weeks = ref(_week)

// 运动员分类ID， 男单，女单什么的
const categoryId = ref(6)
const cationButIndex = ref(6)
const p1_country = ref('0')

/*const cationBut = ref([
    {id: 6, name: "MAN'S SINGLES"},
    {id: 7, name: "WOMAN'S SINGLES"},
    {id: 8, name: "MAN'S DOUBLES"},
    {id: 9, name: "WOMAN'S DOUBLES"},
    {id: 10, name: "MIXED DOUBLES"}
])*/
const cationBut = ref([
    {id: 6, name: 'button.manSingles'},
    {id: 7, name: "button.womanSingles"},
    {id: 8, name: "button.manDoubles"},
    {id: 9, name: "button.womanDoubles"},
    {id: 10, name: "button.mixedDoubles"}
])

const request = ref({
    page: 1,
    category_id: categoryId,
    publication_id: publicationId,
    p1_country: p1_country
})

const modal = ref({}) as Ref<Modal>
const loadingModal = ref({}) as Ref<Modal>

onMounted(() => {
    modal.value = new Modal('#breakdownModal', {backdrop: 'static'})
    loadingModal.value = new Modal('#loadingModal', {backdrop: 'static'})
})

// 一个计算属性 ref
const title = computed(() => {
    let name = '出错'
    cationBut.value.forEach((cation) => {
        if (cation.id === categoryId.value) {
            console.log('cation.id=>', cation.id, 'cationButIndex=>', cationButIndex, ', return')
            return (name = cation.name)
        }
    })
    return name
})

function requestApi() {
    rankingIndex(request.value).then(function (res) {
        console.log('res=>', res)
        rankings.value = res
        rankings.value.meta.current = res.meta.current_page
        rankings.value.meta.last = res.meta.last_page
        rankings.value.meta.next = res.meta.current_page + 1
        rankings.value.meta.prev = res.meta.current_page - 1
        //console.log('rankings=>', rankings)
    })
}

function pagination(param: string) {
    console.log('enter function pagination')
    if (param === 'first' && rankings.value.meta.current > 1) {
        request.value.page = 1
    } else if (param === 'next' && rankings.value.meta.current < rankings.value.meta.last) {
        request.value.page = rankings.value.meta.current + 1
    } else if (param === 'prev' && rankings.value.meta.current > 1) {
        request.value.page = rankings.value.meta.current - 1
    } else if (param === 'last' && rankings.value.meta.current < rankings.value.meta.last) {
        request.value.page = rankings.value.meta.last
    } else {
        console.log('出错了, param=>', param)
        return
    }
    requestApi()
}

function handleCatId(catId: number) {
    console.log('catId=>', catId)
    categoryId.value = catId
    request.value.page = 1
    requestApi()
}

getPublicationIds().then(function (res) {
    console.log('getPublicationIds res=>', res)
    publicationIds.value = res
    publicationId.value = res[0]
})

function showBreakdownModal(rankingId: number) {
    console.log('rankingId', rankingId);
    loadingModal.value.show()
    getBreakdowns(rankingId).then(function (res) {
        console.log('getBreakdowns res=>', res)
        loadingModal.value.hide()
        breakdowns.value = res.data
        console.log('breakdowns value=>', breakdowns.value)
        modal.value.show()
    })
}

// 可以直接侦听一个 ref
watch(publicationId, async (newQuestion, oldQuestion) => {
    try {
        requestApi()
    } catch (error) {
        console.log(error)
    } finally {
    }
})

function handleP1Country(p1Country: string)  {
    try {
        p1_country.value = p1Country
        requestApi()
    } catch (error) {
        console.log(error)
    } finally {
    }
}


requestApi()
getWeeks().then(function(res){
    console.log('getWeeks res=>', res)
    weeks.value = res;
    publicationId.value = res[0].id
    console.log('publicationId.value=>', publicationId.value)
})


const changeLang = (parameter: any) => {
    const lang = parameter.target.value;
    console.log('lang=>', lang)
    locale.value = lang; // 切换语言
    localStorage.setItem('LANG', lang); // 本地存储当前语言类型
}

</script>

<template>
    <div class="row">
        <div class="col">
            <div class="row justify-content-center m-4 align-items-center" >
                <h1 class="fs-2 font-bold underline col-auto col-form-label">
                    {{ $t('message.title') }}
                </h1>
                <div class="col-auto">
                    <select class="form-select" aria-label="Default select example" v-model="publicationId">
                        <option v-for="week in weeks" :value="week.id">{{ week.display }}</option>
                    </select>
                </div>
                <div class="col-auto">
                    <select class="form-select" name="lang" id="lang-select" @change="changeLang">
                        <option value="en" selected>English</option>
                        <option value="zhCn">简体中文</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="row p-2 fs-5">
        <div class="col text-center">
            <button v-for="obj in cationBut" class="btn collapseBut m-1"
                    :class="categoryId === obj.id ? 'btn-primary' : 'btn-secondary'"
                    id="collapseButton1" type="button" aria-expanded="false" :key="obj.id"
                    @click="handleCatId(obj.id)"
            >
                {{ $t(obj.name) }}
            </button>
        </div>
    </div>

    <div class="row p-2">
        <div v-if="loading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">{{ $t('message.loading') }}...</span>
            </div>
        </div>
    </div>

    <div class="row fs-6">
        <div class="col">
            <div class="card card-body">
                <div class="row">
                    <div class="col table-responsive">
                        <h3 class="text-center">{{ $t(title) }}</h3>
                        <table class="table table-striped table-hover table-bordered text-center">
                            <thead>
                                <tr>
                                    <th scope="col">{{ $t('table.rank') }}</th>
                                    <th scope="col">{{ $t('table.name') }}</th>
                                    <th scope="col">{{ $t('table.nation') }}
                                        <a v-if="p1_country!=='0'" class="fs-6" @click="handleP1Country('0')">
                                            {{ $t('a.clear') }}
                                        </a>
                                    </th>
                                    <th scope="col">{{ $t('table.birthday') }}</th>
                                    <th scope="col">{{ $t('table.tournaments') }}</th>
                                    <th scope="col">{{ $t('table.points') }}</th>
                                    <th scope="col">{{ $t('table.record') }}</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr v-for="ranking in rankings.data" :key="ranking.id">
                                <th scope="row">
                                    {{ ranking.rank }}
                                    <i v-if="ranking.rank_change > 0" class="bi bi-caret-up-fill text-primary">
                                        {{ ranking.rank_change }}
                                    </i>
                                    <i v-if="ranking.rank_change < 0" class="bi bi-caret-down-fill text-danger">
                                        {{ Math.abs(ranking.rank_change) }}
                                    </i>
                                </th>
                                <td class="text-start px-2">
                                    {{ ranking.player1_name }}
                                    <br v-if="ranking.player2_name"/>
                                    <span v-if="ranking.player2_name">{{ ranking.player2_name }}</span>
                                </td>
                                <td class="text-start px-2">
                                    <img :src="ranking.country_img" style="width: 30px; border: 0 solid steelblue"/>
                                    <a type="button" @click="handleP1Country(ranking.p1_country)" class="px-2 link link-primary">
                                        {{ ranking.country_name }}</a>
                                </td>
                                <td>
                                    {{ ranking.player1_birth }}
                                    <div v-if="ranking.player2_birth">{{ ranking.player2_birth }}</div>
                                </td>
                                <td>{{ ranking.tournaments }}</td>
                                <td>{{ ranking.points }}</td>
                                <td>
                                    <button
                                            type="button"
                                            class="btn btn-secondary btn-sm"
                                            @click="showBreakdownModal(ranking.id )"
                                    >
                                        {{ $t('button.view') }}
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <nav aria-label=" Page navigation">
                            <ul class="pagination mx-auto" style="width: 400px;">
                                <li class="page-item disabled">
                                    <a class="page-link">
                                        Page <label id="pageCurrent">{{ rankings.meta.current }}</label> of
                                        <label id="pageTotal">{{ rankings.meta.last }}</label></a>
                                </li>
                                <li class="page-item" :class="rankings.meta.current == 1 ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('first')">{{ $t('page.first') }}</a>
                                </li>
                                <li class="page-item" :class="rankings.meta.current == 1 ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('prev')">{{ $t('page.prev') }}</a>
                                </li>
                                <li class="page-item" :class="rankings.meta.current == rankings.meta.last ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('next')">{{ $t('page.next') }}</a>
                                </li>
                                <li class="page-item" :class="rankings.meta.current == rankings.meta.last ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('last')">{{ $t('page.last') }}</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <!-- <RouterView /> -->
    </div>

    <!-- Modal -->
    <div class="modal text-center" id="breakdownModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                        {{ $t('message.gameRecord') }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">{{ $t('table.yearWeek') }}</th>
                            <th scope="col">{{ $t('table.name') }}</th>
                            <th scope="col">{{ $t('table.ranking') }}</th>
                            <th scope="col">{{ $t('table.points') }}</th>
                        </tr>
                        </thead>
                        <tbody class="table-group-divider" id="modalBody">
                        <tr v-for="breakdown in breakdowns">
                            <td>{{ breakdown.date }}</td>
                            <td class="text-start"><a :href="breakdown.url">{{ breakdown.name }}</a></td>
                            <td>{{ breakdown.result }}</td>
                            <td>{{ breakdown.points }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{$t('button.close')}}</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal text-center p-2" id="loadingModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="d-flex justify-content-center p-2">
                    <div class="spinner-border p-2" role="status">
                        <span class="visually-hidden">{{ $t('message.loading') }}...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped></style>
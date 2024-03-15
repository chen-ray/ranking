<!--
 * @Author: Chen Ray
 * @Date: 2024-03-10 18:47:20
 * @LastEditTime: 2024-03-12 01:35:35
 * @FilePath: \ranking-front-end\src\App.vue
 * @Description: Do not edit
-->
<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
//import HelloWorld from './components/HelloWorld.vue'
import {ref, computed, onMounted, reactive, watch} from 'vue'
import {Modal} from 'bootstrap'

import {index as rankingIndex, getPublicationIds, getBreakdowns, getWeeks} from './api/ranking'

const loading = ref(false)
const publicationId = ref('0')
const publicationIds = ref({})
let rankings = ref([])
let breakdowns = ref([])
let weeks = ref([])
let page = ref({
    current: 1,
    total: 10,
    first: 1,
    last: 10,
    next: 2,
    prev: 1
})

// 运动员分类ID， 男单，女单什么的
const categoryId = ref(6)
const cationButIndex = ref(6)
const p1_country = ref('0')

const cationBut = ref([
    {id: 6, name: "MAN'S SINGLES"},
    {id: 7, name: "WOMAN'S SINGLES"},
    {id: 8, name: "MAN'S DOUBLES"},
    {id: 9, name: "WOMAN'S DOUBLES"},
    {id: 10, name: "MIXED DOUBLES"}
])

const request = ref({
    page: 1,
    category_id: categoryId,
    publication_id: publicationId,
    p1_country: p1_country
})

const modal = ref({})
const loadingModal = ref({})

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
        rankings.value = res.data
        page.value.current = res.meta.current_page
        page.value.total = res.meta.total
        page.value.current = res.meta.current_page
        page.value.last = res.meta.last_page
        page.value.next = res.meta.current_page + 1
        page.value.prev = res.meta.current_page - 1
        console.log('rankings=>', rankings)
    })
}

function pagination(param: string) {
    console.log('enter function pagination')
    if (param === 'first' && page.value.current != 1) {
        request.value.page = 1
    } else if (param === 'next' && page.value.current != page.value.last) {
        request.value.page = page.value.current + 1
    } else if (param === 'prev' && page.value.current != 1) {
        request.value.page = page.value.current - 1
    } else if (param === 'last' && page.value.current != page.value.last) {
        request.value.page = page.value.last
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
console.log('import.meta.env=>', import.meta.env)
</script>

<template>
    <div class="row">
        <div class="col">
            <div class="row justify-content-center m-4 align-items-center" >
                <h1 class="fs-2 font-bold underline col-auto col-form-label">
                    BWF ranking No.
                </h1>
                <div class="col-auto">
                    <select class="form-select" aria-label="Default select example" v-model="publicationId">
                        <option v-for="week in weeks" :value="week.id">{{ week.display }}</option>
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
                {{ obj.name }}
            </button>
        </div>
    </div>

    <div class="row p-2">
        <div v-if="loading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>

    <div class="row fs-6">
        <div class="col">
            <div class="card card-body">
                <div class="row">
                    <div class="col">
                        <h3 class="text-center">{{ title }}</h3>
                        <table class="table table-striped table-hover table-bordered text-center">
                            <thead>
                            <tr>
                                <th scope="col">RANK</th>
                                <th scope="col">NAME</th>
                                <th scope="col">NATION
                                    <a v-if="p1_country!=='0'" class="fs-6" @click="handleP1Country('0')">clear</a></th>
                                <th scope="col">BIRTHDAY</th>
                                <th scope="col">TOURNAMENTS</th>
                                <th scope="col">POINTS</th>
                                <th scope="col">RECORD</th>
                            </tr>
                            </thead>
                            <tbody class="table-group-divider">
                            <tr v-for="ranking in rankings" :key="ranking.id">
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
                                    <img :src="ranking.country_img" style="width: 35px; border: 0px solid steelblue"/>
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
                                        view
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
                                        Page <label id="pageCurrent">{{ page.current }}</label> of <label id="pageTotal">{{ page.last }}</label></a>
                                </li>
                                <li class="page-item" :class="page.current == 1 ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('first')">First</a>
                                </li>
                                <li class="page-item" :class="page.current == 1 ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('prev')">Prev</a>
                                </li>
                                <li class="page-item" :class="page.current == page.last ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('next')">Next</a>
                                </li>
                                <li class="page-item" :class="page.current == page.last ? 'disabled' : ''">
                                    <a class="page-link" @click="pagination('last')">Last</a>
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
                    <h1 class="modal-title fs-5" id="exampleModalLabel">征战记录</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped table-hover table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">YEAR/WEEK</th>
                            <th scope="col">NAME</th>
                            <th scope="col">RANKING</th>
                            <th scope="col">POINTS</th>
                            <th scope="col">OPERATION</th>
                        </tr>
                        </thead>
                        <tbody class="table-group-divider" id="modalBody">
                        <tr v-for="breakdown in breakdowns">
                            <td>{{ breakdown.date }}</td>
                            <td class="text-start">{{ breakdown.name }}</td>
                            <td>{{ breakdown.result }}</td>
                            <td>{{ breakdown.points }}</td>
                            <td><a :href="breakdown.url">website</a></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal text-center p-2" id="loadingModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="d-flex justify-content-center p-2">
                    <div class="spinner-border p-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<style scoped></style>

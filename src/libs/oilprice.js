import firebase from './firebase'
import moment from 'moment'

let oilTypes = null
let operators = null
let currentPrice = null
let tomorrowPrice = null

export default {

    fetchOilTypes(){
        return new Promise((resolve, reject)=>{

            if(oilTypes){
                return resolve(oilTypes)
            }
            firebase.database().ref("oil_types").once('value').then(snapshot=>{
                oilTypes = snapshot.val()
                return resolve(oilTypes)
            })

        })
    },
    fetchOperators(){
        return new Promise((resolve, reject)=>{

            if(operators){
                return resolve(operators)
            }
            firebase.database().ref("operators").once('value').then(snapshot=>{
                operators = snapshot.val()
                return resolve(operators)
            })

        })
    },
    fetchCurrentPrice(){
        return new Promise((resolve, reject)=>{

            if(currentPrice){
                return resolve(currentPrice)
            }
            firebase.database().ref("price/current").once('value').then(snapshot=>{
                currentPrice = snapshot.val()
                return resolve(currentPrice)
            })

        })
    },
    fetchTomorrowPrice(){
        return new Promise((resolve, reject)=>{

            let date = moment()
            date.add(1, 'day')
            let dateFormat = date.format("YYYY-MM-DD")
            
            if(tomorrowPrice){
                return resolve(tomorrowPrice)
            }
            firebase.database().ref("price/histories/"+dateFormat).once('value').then(snapshot=>{
                tomorrowPrice = snapshot.val()
                return resolve(tomorrowPrice)
            })

        })
    },
    init(){
        let ps = [
            this.fetchOilTypes(),
            this.fetchOperators(),
            this.fetchCurrentPrice(),
            this.fetchTomorrowPrice()
        ]
        return Promise.all(ps).then(res=>{

            return {
                oilTypes,
                operators,
                currentPrice,
                tomorrowPrice
            }

            /*Object.keys(currentPrice.operators).forEach((operatorKey)=>{

                let operatorValue = currentPrice.operators[operatorKey]
                let operatorName = operators[operatorKey]

                console.log(operatorKey, operatorName, operatorValue)

            })*/

        })
    }

}
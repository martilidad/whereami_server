import {Moment} from "moment";

export interface Guess {

  Challenge_Location_ID: number,
  Lat: number
  Long: number
  Score: number
  Distance: number
  Username: string | undefined
  Pub_Date: string | undefined

}

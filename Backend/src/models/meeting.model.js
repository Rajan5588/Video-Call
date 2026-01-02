const meetingSchema = new Schema({
    user_id:{
        type:String
    },
    meetingCode:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }
})


const MeetingModel=mongoose.model("Meeting",meetingSchema)
export {MeetingModel}
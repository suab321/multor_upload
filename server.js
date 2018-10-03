const express=require('express')
const bp=require('body-parser')
const multer=require('multer')
const path=require('path')

const app=express()
app.use(bp.urlencoded({extended:false}))
app.use(bp.json())
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(express.static('views'))

const storage=multer.diskStorage({destination:'./public/upload/',filename:(req,file,cb)=>{
    cb(null,file.fieldname+Date.now()+path.extname(file.originalname))
}});

const upload=multer({storage,fileFilter:(req,file,cb)=>check(file,cb)}).single("image");

const check=(file,cb)=>{
    const types=/jpeg|jpg|png|gif/;
    const filetypes=types.test(path.extname(file.originalname).toLowerCase())
    const mimtypes=types.test(file.mimetype)
    if(filetypes && mimtypes)
        cb(null,true)
    else
        cb('Select an image only')
}
app.get('/',(req,res)=>{
    res.render('new');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err)
            res.render('new',{msg:'select image file'})
        else if(req.file===undefined)
            res.render('new',{msg:'Select a File'})
        else
            res.render('front',{src:`upload/${req.file.filename}`})
    })
})
app.listen(process.env.PORT||3002)
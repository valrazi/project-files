const express = require('express');
const multer = require("multer");
const { diskStorage } = require('../multer')
const { registerView, loginView, registerAdmin, loginAdmin,
    dashboardAdminView, logoutAdmin, uploadFiles, uploadView,
    listView, downloadFiles, showFiles, updateLinkZoom, editFiles, editFileDB} = require('../controllers/adminController')
const router = express.Router()
const isAdmin = (req, res, next) => {
    if (!req.session.adminId) {
        console.log('please log in');
        res.redirect('/admin/login')
    } else {
        next()
    }
}
router.get('/dashboard', isAdmin,dashboardAdminView)
router.get('/register', registerView)
router.get('/login', loginView)
router.post('/login', loginAdmin)
router.post('/register', registerAdmin)
router.get('/logout', logoutAdmin)

router.get("/upload", isAdmin, uploadView)
router.post('/upload', isAdmin,multer({ storage: diskStorage }).array("files"), uploadFiles)

router.get("/list",isAdmin,listView)
router.get("/download/:fileName" , downloadFiles)
router.get("/show/:fileName", showFiles)

router.put('/file/:fileId', updateLinkZoom)
router.get('/file/:fileId', isAdmin,editFiles)
router.post('/file/:fileId', isAdmin,multer({storage:diskStorage}).single('file'),editFileDB)
module.exports = router
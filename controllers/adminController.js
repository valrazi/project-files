const bcrypt = require("bcryptjs");
const db = require("../models/prisma");
const fs = require('fs');
const e = require("express");
require("dotenv").config();
module.exports = {
  registerView(req, res) {
    res.render("registerAdmin", {});
  },
  loginView(req, res) {
    res.render("loginAdmin", {});
  },
  async registerAdmin(req, res) {
    const { email, password } = req.body;
    if (email && password) {
      db.admin
        .findUnique({
          where: {
            email: email,
          },
        })
        .then(async (admin) => {
          if (admin) {
            console.log("email already exists");
            res.redirect("/admin/register");
          } else {
            const newAdmin = {
              email: email,
              password: bcrypt.hashSync(password, 10),
              role: "ADMIN",
            };
            try {
              await db.admin.create({ data: newAdmin });
              res.redirect("/admin/login");
            } catch (error) {
              console.log(error);
              res.redirect("/admin/register");
            }
          }
        });
    }
  },
  async loginAdmin(req, res) {
    const { email, password } = req.body;
    if (email && password) {
      db.admin
        .findUnique({
          where: {
            email: email,
          },
        })
        .then(async (admin) => {
          if (admin) {
            if (bcrypt.compareSync(password, admin.password)) {
              req.session.adminId = admin.email;
              res.redirect("/admin/dashboard");
            } else {
              console.log("wrong password");
            }
          } else {
            console.log("admin not found");
            res.redirect("/admin/login");
          }
        });
    }
  },
  dashboardAdminView(req, res) {
    const adminMail = req.session.adminId;
    res.render("dashboard", { adminEmail: adminMail });
  },
  logoutAdmin(req, res) {
    req.session.destroy();
    res.redirect("/admin/login");
  },
  uploadView(req, res) {
    res.render("upload_file", {});
  },
  async uploadFiles(req, res) {
    const arrFiles = req.files;
    const adminLoggedIn = req.session.adminId ? req.session.adminId : 'public';

    try {
      await db.files.create({
        data: {
          file1_path: encodeURI(arrFiles[0].filename),
          file2_path: encodeURI(arrFiles[1].filename),
          file3_path: encodeURI(arrFiles[2].filename),
          file1_name: arrFiles[0].originalname,
          file2_name: arrFiles[1].originalname,
          file3_name: arrFiles[2].originalname,
          createdBy: adminLoggedIn,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
  async listView(req, res) {
    let arrFiles = []
    // let page = 0
    // if(req.query.page && req.query.page.length > 0) {
    //   if(Number(req.query.page)) {
    //     page = Number(req.query.page)
    //   }
    // }
    if (req.query.filename && req.query.filename.length > 0) {

      const files = await db.files.findMany({
        where: {
          OR: [
            {
              file1_name: {
                contains: req.query.filename,
                mode: 'insensitive'
              }
            },
            {
              file2_name: {
                contains: req.query.filename,
                mode: 'insensitive'
              }
            },
            {
              file3_name: {
                contains: req.query.filename,
                mode: 'insensitive'
              }
            }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
      arrFiles = files
    } else {
      arrFiles = await db.files.findMany({
        orderBy: {
          createdAt: 'asc'
        }
      })
    }
    res.render("list_file", { files: arrFiles })
  },
  async downloadFiles(req, res) {
    const fileName = req.params.fileName
    const pathFile = `${appRoot}/uploads/${fileName}`
    res.download(pathFile)
  },
  async showFiles(req, res) {
    const fileName = req.params.fileName
    const pathFile = `${appRoot}/uploads/${fileName}`
    fs.readFile(pathFile, function (err, data) {
      if (err) {
        console.log(err);
        res.send(err)
      }
      res.end(data)
    })
  },
  async updateLinkZoom(req, res) {
    try {
      const fileId = req.params.fileId
      const { link_zoom } = req.body
      const fileFound = await db.files.findUnique({
        where: {
          id: Number(fileId)
        }
      })
      if (fileFound) {
        await db.files.update({
          where: {
            id: Number(fileId)
          },
          data: {
            link_zoom: link_zoom ? link_zoom : null
          }
        },)
        return res.status(200).json({
          status: 'success',
          data: await db.files.findUnique({
            where: {
              id: Number(fileId)
            }
          })
        })
      }

      return res.status(404).json({
        error: 'file not found'
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      })
    }
  },
  async editFiles(req, res) {
    try {
      const fileId = req.params.fileId
      const fileFound = await db.files.findUnique({
        where: {
          id: Number(fileId)
        }
      })
      if (fileFound) {
        return res.render('edit_file', { file: fileFound })
      }
      return res.redirect('/admin/list')
    } catch (error) {
      console.log(error);
      return res.redirect('/admin/list')
    }
  },
  async editFileDB(req, res){
    try {
      const fileId = req.params.fileId
      const file = req.file
      const code = Number(req.body.code)
      const fileFound = await db.files.findUnique({
        where: {
          id: Number(fileId)
        }
      })
      if (fileFound) {
        switch(code) {
          case 1:
            await db.files.update({
              where: {
                id: Number(fileId)
              },
              data: {
                file1_name: file.originalname,
                file1_path: file.filename
              }
            })
            break;
          case 2:
            await db.files.update({
              where: {
                id: Number(fileId)
              },
              data: {
                file2_name: file.originalname,
                file2_path: file.filename
              }
            })
            break;
          case 3:
            await db.files.update({
              where: {
                id: Number(fileId)
              },
              data: {
                file3_name: file.originalname,
                file3_path: file.filename
              }
            })
            break;
        }
        return res.status(200).json({
          data: 'success'
        })
      }
      return res.status(400).json({
        error: 'file not found!'
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      })
    }
  }
};

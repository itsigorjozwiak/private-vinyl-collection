const express = require('express');
const router = express.Router();
const Vinyl = require('../models/Vinyl');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', async function(req, res, next) {
  try {
    const userId = req.session.userId;
    const szukanaFraza = req.query.szukaj || "";
    const filtrGatunek = req.query.filtrGatunek || "";
    const filtrRok = req.query.filtrRok || "";
    
    const errorMsg = req.query.error;
    const successMsg = req.query.success;

    let listaPlyt = [];
    
    if (userId) {
        let warunki = { wlasciciel: userId };

        if (szukanaFraza) {
          warunki.$or = [
            { tytul: { $regex: szukanaFraza, $options: 'i' } },
            { wykonawca: { $regex: szukanaFraza, $options: 'i' } }
          ];
        }

        if (filtrGatunek) {
          warunki.gatunek = filtrGatunek;
        }

        if (filtrRok) {
          warunki.rok = filtrRok;
        }

        listaPlyt = await Vinyl.find(warunki).sort({ ocena: -1, dataDodania: -1 });
        
        const user = await User.findById(userId);
        res.locals.userName = user ? user.nick : 'Melomanie';
    }

    res.render('index', { 
      title: 'Winylovenia', 
      winyle: listaPlyt,
      szukanaFraza: szukanaFraza,
      filtrGatunek: filtrGatunek,
      filtrRok: filtrRok,
      errorMsg: errorMsg,
      successMsg: successMsg
    });
  } catch (err) {
    console.error(err);
    res.render('error', { message: "Błąd aplikacji", error: err });
  }
});

router.post('/dodaj', upload.single('okladkaPlik'), async function(req, res) {
  if (!req.session.userId) return res.redirect('/?error=Musisz być zalogowany');

  try {
    let sciezkaDoPliku = "";
    if (req.file) {
      sciezkaDoPliku = '/uploads/' + req.file.filename;
    }

    let finalnyGatunek = req.body.gatunek;
    if (req.body.gatunek === 'Inne' && req.body.gatunekCustom) {
        finalnyGatunek = req.body.gatunekCustom;
    }

    const nowaPlyta = new Vinyl({
      tytul: req.body.tytul,
      wykonawca: req.body.wykonawca,
      gatunek: finalnyGatunek,
      rok: req.body.rok,
      ocena: req.body.ocena,
      okladka: sciezkaDoPliku,
      wlasciciel: req.session.userId
    });
    
    await nowaPlyta.save();
    res.redirect('/?success=Dodano płytę');
  } catch (err) {
    res.redirect('/?error=Błąd dodawania: ' + err.message);
  }
});

router.post('/edytuj', async function(req, res) {
    if (!req.session.userId) return res.redirect('/');
    
    try {
        const { id, tytul, wykonawca, rok, ocena, gatunek, gatunekCustom } = req.body;
        
        let updateData = { tytul, wykonawca, rok, ocena };
        
        if (gatunek === 'Inne' && gatunekCustom) {
            updateData.gatunek = gatunekCustom;
        } else if (gatunek) {
            updateData.gatunek = gatunek;
        }

        await Vinyl.findOneAndUpdate(
            { _id: id, wlasciciel: req.session.userId }, 
            updateData
        );
        
        res.redirect('/?success=Płyta została zaktualizowana');
    } catch (err) {
        res.redirect('/?error=Błąd edycji');
    }
});

router.get('/usun/:id', async function(req, res) {
    if (!req.session.userId) return res.redirect('/');

    try {
        await Vinyl.findOneAndDelete({ _id: req.params.id, wlasciciel: req.session.userId });
        res.redirect('/?success=Usunięto płytę');
    } catch (err) {
        res.redirect('/?error=Nie udało się usunąć');
    }
});

router.post('/register', async (req, res) => {
  try {
    const { nick, email, haslo } = req.body;

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Niepoprawny format email' });
    }

    const existingNick = await User.findOne({ nick });
    if (existingNick) {
        return res.status(400).json({ error: 'Ten nick jest już zajęty' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ error: 'Ten email jest już zarejestrowany' });
    }

    const hashedPassword = await bcrypt.hash(haslo, 10);
    const user = new User({ nick, email, haslo: hashedPassword });
    await user.save();
    
    req.session.userId = user._id;
    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: 'Błąd serwera: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { loginInput, haslo } = req.body;
    
    const user = await User.findOne({ 
        $or: [
            { email: loginInput }, 
            { nick: loginInput }
        ]
    });

    if (user && await bcrypt.compare(haslo, user.haslo)) {
      req.session.userId = user._id;
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: 'Błędny nick/email lub hasło' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/delete-account', async (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    try {
        await Vinyl.deleteMany({ wlasciciel: req.session.userId });
        await User.findByIdAndDelete(req.session.userId);
        req.session.destroy();
        res.redirect('/?success=Konto i kolekcja zostały usunięte');
    } catch (err) {
        res.redirect('/?error=Błąd usuwania konta');
    }
});

module.exports = router;
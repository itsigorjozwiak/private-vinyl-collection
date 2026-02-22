# 🎵 Winylovenia - Domowe Archiwum Dobrego Brzmienia

<a href="https://winylovenia.onrender.com/" target="_blank">
  <img width="3168" height="1344" alt="winylovenia" src="https://github.com/user-attachments/assets/0c27416e-9493-4d2d-b907-d3401769a09a" />
</a>

**🌐 Zobacz aplikację na żywo:** [https://winylovenia.onrender.com/](https://winylovenia.onrender.com/)

## 📖 O projekcie
Winylovenia to aplikacja webowa typu Full-Stack stworzona z myślą o kolekcjonerach płyt winylowych. Pozwala użytkownikom na stworzenie cyfrowego archiwum swojej fizycznej kolekcji muzycznej. Projekt realizuje pełen cykl życia danych – od bezpiecznej rejestracji użytkownika, przez zarządzanie zasobami (dodawanie, edycja, usuwanie płyt), aż po zaawansowane filtrowanie zbiorów.

Aplikacja została zbudowana w oparciu o architekturę **MVC (Model-View-Controller)**.

## ✨ Główne funkcjonalności
* **Autoryzacja użytkowników:** Bezpieczna rejestracja i logowanie (hasła szyfrowane przy użyciu `bcryptjs`). Sesje użytkowników są zarządzane przez `express-session`.
* **Pełen CRUD:** Dodawanie nowych winyli, edytowanie ich szczegółów (tytuł, autor, gatunek, rok, ocena, link do okładki) oraz usuwanie.
* **Ochrona danych:** Użytkownik ma dostęp i możliwość edycji wyłącznie własnej kolekcji płyt.
* **Wyszukiwanie i filtrowanie (Live Search):** Dynamiczne wyszukiwanie płyt po tytule/wykonawcy bez przeładowywania strony (Debouncing) oraz filtrowanie po gatunku i roku wydania.
* **Responsywny interfejs:** Nowoczesny, "jazzowy" design, dopasowujący się do urządzeń mobilnych i desktopowych.

## 🛠️ Technologie
* **Back-end:** Node.js, Express.js
* **Baza danych:** MongoDB (Atlas), Mongoose
* **Front-end:** EJS, HTML5, CSS3, JavaScript (AJAX/Fetch API)
* **UI Framework:** Bootstrap 5
* **Bezpieczeństwo:** bcryptjs (haszowanie haseł)

## ☁️ Architektura Chmurowa i Wdrożenie
Projekt został w pełni wdrożony w chmurze, co gwarantuje jego wysoką dostępność i stabilność. Aby zminimalizować opóźnienia sieciowe i zapewnić najwyższą wydajność, cała architektura została umieszczona w najbliższej Polsce serwerowni chmurowej, czyli we Frankfurcie.

* **Hosting Aplikacji:** Kod serwera hostowany jest na platformie **Render**. Fizycznie usługa działa w serwerowniach Amazona zlokalizowanych we **Frankfurcie**.
* **Baza Danych:** Aplikacja łączy się z nierelacyjną bazą danych **MongoDB Atlas**. Klaster bazy również został skonfigurowany w regionie **AWS Frankfurt**, co zapewnia błyskawiczną i bezpieczną komunikację między aplikacją webową a danymi użytkowników.


https://github.com/user-attachments/assets/7d524054-3e67-4d9f-9942-e27168f8dfbe


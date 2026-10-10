# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Impossible Tic-Tac-Toe

  A static React + TypeScript game with an unbeatable Minimax opponent. The AI searches the complete game tree with alpha-beta pruning and plays optimally as either X or O.

  ## Development

  ```sh
  npm install
  npm run dev
  ```

  ## Verification

  ```sh
  npm test
  npm run build
  npm run lint
  ```

  The exhaustive test traverses every possible sequence of human moves against the AI as each mark and with either side moving first. A draw is the best possible result for perfect human play.

  ## Static deployment

  Run `npm run build` and upload the contents of `dist/` to the website root in Hostinger. The app has no backend or server-side runtime requirements.


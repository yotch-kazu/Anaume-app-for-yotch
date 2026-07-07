# GitHub Pagesで公開する手順

このアプリ側にGitHubのパスワードやトークンを書く必要はありません。
GitHubにログインした状態でリポジトリを作り、コードをpushすれば公開できます。

## 1. GitHubでリポジトリを作る

GitHubで新しいリポジトリを作ります。
公開URLを友達に送る用途なら、Publicリポジトリが一番簡単です。

## 2. このプロジェクトをpushする

ローカルでGitを初期化していない場合は、次の流れでpushします。

```bash
git init
git add .
git commit -m "Create blank memory app"
git branch -M main
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

## 3. GitHub Pagesの公開元をActionsにする

GitHubのリポジトリ画面で次を設定します。

1. Settingsを開く
2. Pagesを開く
3. Build and deploymentのSourceをGitHub Actionsにする

`main` にpushすると、`.github/workflows/deploy-pages.yml` が自動で実行されます。

## 4. 共有URL

公開後のURLは通常この形です。

```text
https://ユーザー名.github.io/リポジトリ名/
```

問題セットを直接開く場合は、次のように `?set=` を付けます。

```text
https://ユーザー名.github.io/リポジトリ名/?set=dsp/dsp09
```

このURLをLINEで送れば、スマホでタップして開けます。

## 5. JSONを追加したとき

1. `public/problems/科目名/回名.json` を追加する
2. `public/problems/index.json` に項目を追加する
3. commitしてpushする
4. GitHub Actionsの完了後、公開ページに反映される

# DailyMenuApp - 献立管理・在庫連動システム

献立の計画から材料の在庫管理までを一元化し、日々の食事管理を楽しく効率化するためのWebアプリケーションです。
バックエンドに Symfony、フロントエンドに Angular を採用し、疎結合でメンテナンス性の高いモダンな構成で開発しています。

## Screenshots

### Calendar View

### Weekly View

### Daily View

### Daily Form


## 技術スタック

### Backend
- **Language:** PHP 8.4
- **Framework:** Symfony 8.x
- **Database:** mysql (Development/Production), SQLite (Testing)
- **ORM:** Doctrine ORM
- **Testing:** PHPUnit (Unit/Integration)
- **Static Analysis:** PHPStan (Level 5)
- **Code Quality:** PHP-CS-Fixer

### Frontend
- **Language:** TypeScript
- **Framework:** Angular 21.x
- **Styling:** Bootstrap 5
- **Testing:** Cypress (E2E)
- **Code Quality:** angular-eslint

### Infrastructure / Tools
- **Security:** CSRF Protection, Symfony Security (Session-based)

## 主な機能

- **カレンダー形式の献立管理:** 日、週、月単位での献立確認と直感的な操作による移動。
- **柔軟な献立登録:** 1日最大3食、1食に対して複数のメニューを登録可能。
- **在庫管理システム:** 材料の在庫状況を管理し、献立作成と連動。
- **ユーザー認証:** セキュアなログイン機能と、権限に基づいたロール管理。
- **RESTful API:** フロントエンドとバックエンドをAPIで完全に分離した設計。

## アーキテクチャと設計のこだわり

### 1. 設計について

保守性を意識し、以下の設計を採用
- Controller
  - リクエスト制御のみ
- UseCase
  - ビジネスロジック
- Entity
  - ドメインモデル

### 2. テスト駆動の品質保証
堅牢なシステムを構築するため、多角的なテストを実施しています。
- **Entity Unit Test:** プロパティ制約や境界値を PHPUnit で網羅。
- **API Integration Test:** コントローラーとDB間の連携、および認証・CSRF保護の検証。
- **E2E Test:** Cypress を使用し、ユーザーの実際の操作（カレンダー移動、フォーム入力、バリデーション表示）をシミュレート。

### 3. セキュリティ
- **CSRF保護:** API 経由のPOSTリクエストに対しても、独自のトークン発行・検証フローを構築し、セキュアなデータ操作を実現。
- **型安全性:** PHPStanのLevel 5をターゲットにし、実行時エラーを最小限に抑制。

## セットアップ

### 前提条件
- PHP 8.4+
- Node.js 20+

## 今後の展望
- **今後の改善案:** 食事画像アップロード機能の追加、PWA化によるモバイル体験の向上。
- **CI/CDの導入**
  - Pull Request 作成時に PHPUnit / Cypress / PHPStan の自動実行
  - コードスタイルチェック（PHP-CS-Fixer）
  - main ブランチへのマージ時に 自動デプロイ

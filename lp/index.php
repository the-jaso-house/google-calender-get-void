<?php
/**
 * VoiceCamp 動画学習コース ランディングページ
 *
 * レスポンシブ対応: 760px以下（スマホ・タブレット）/ 761px以上（PC）
 */
require_once __DIR__ . '/../includes/header.php';
?>

<!-- LP メインコンテンツ -->
<main class="lp-main">

    <!-- ============================================
         ヒーローセクション
    ============================================= -->
    <section class="hero" id="hero">
        <div class="hero__inner">
            <div class="hero__content">
                <p class="hero__catch">プロ講師のレッスンを手軽に実践！<br>最適なオリジナル教材で学べます！</p>
                <div class="hero__badge">
                    <span class="hero__badge-logo">VoiceCamp</span>
                </div>
                <h1 class="hero__title">動画学習コース</h1>
            </div>
            <div class="hero__device">
                <div class="hero__device-pc">
                    <img src="../assets/images/hero-pc-screen.png" alt="VoiceCamp動画学習コース PC画面イメージ" class="hero__device-img">
                </div>
                <div class="hero__device-tablet">
                    <img src="../assets/images/hero-tablet-screen.png" alt="VoiceCamp動画学習コース タブレット画面イメージ" class="hero__device-img">
                </div>
            </div>
        </div>
        <!-- 装飾要素 -->
        <div class="hero__decoration hero__decoration--calendar">
            <img src="../assets/images/icon-calendar.png" alt="" aria-hidden="true">
        </div>
    </section>

    <!-- ============================================
         キャンペーンセクション
    ============================================= -->
    <section class="campaign" id="campaign">
        <div class="campaign__inner">
            <p class="campaign__label">期間限定キャンペーンを実施中！</p>
            <h2 class="campaign__title">
                <span class="campaign__title-number">2</span>週間の<span class="campaign__title-highlight">無料体験</span>実施中！
            </h2>
            <p class="campaign__description">
                無料お試し動画視聴からコースを申し込みの方、<br class="pc-only">
                2週間無料でお試しいただけます！<br>
                お試し終了後、有料プランへの移行を継続する
            </p>
            <a href="#register" class="campaign__cta btn btn--primary">
                <span class="btn__text">無料登録</span>
            </a>
        </div>
    </section>

    <!-- ============================================
         ABOUTセクション - VoiceCampとは？
    ============================================= -->
    <section class="about" id="about">
        <div class="about__inner">
            <div class="section-header">
                <span class="section-header__label">ABOUT</span>
                <p class="section-header__sub">
                    <img src="../assets/images/logo-voicecamp.png" alt="VoiceCamp" class="section-header__logo">とは？
                </p>
            </div>
            <p class="about__lead">手軽に自宅でレッスンを受講し専門教育を受ける</p>
            <h2 class="about__title">新しいオンラインボイススクール！</h2>
        </div>
    </section>

    <!-- ============================================
         コース紹介セクション
    ============================================= -->
    <section class="course-intro" id="course">
        <div class="course-intro__inner">
            <div class="course-intro__tabs">
                <div class="course-intro__tab course-intro__tab--inactive">
                    <span class="course-intro__tab-label">コース</span>
                    <p class="course-intro__tab-text">月2回のオンライン<br>レッスンを受けたい方は</p>
                    <span class="course-intro__tab-name">オンラインコース</span>
                </div>
                <div class="course-intro__tab course-intro__tab--active">
                    <span class="course-intro__tab-label">コース</span>
                    <p class="course-intro__tab-text">自分のペースで手軽に学びたい方におすすめのコース</p>
                </div>
            </div>
            <div class="course-intro__content">
                <div class="course-intro__info">
                    <h3 class="course-intro__heading">動画学習コースとは？</h3>
                    <p class="course-intro__text">
                        自分の学びたいときに好きな教材で<br>
                        学べる動画視聴がメインの<br>
                        ボイストレーニングコースです。
                    </p>
                </div>
                <div class="course-intro__image">
                    <img src="../assets/images/course-woman.png" alt="動画学習コースで学ぶ女性" class="course-intro__img">
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================
         コンセプトセクション - 思いから生まれました
    ============================================= -->
    <section class="concept" id="concept">
        <div class="concept__inner">
            <div class="concept__header">
                <p class="concept__lead">動画学習コースは<span class="concept__lead-highlight">こんな思い</span>から生まれました</p>
            </div>
            <div class="concept__content">
                <div class="concept__text-area">
                    <div class="concept__logo-box">
                        <img src="../assets/images/logo-voicecamp-white.png" alt="VoiceCamp" class="concept__logo">
                        <span class="concept__logo-suffix">では...</span>
                    </div>
                    <p class="concept__description">
                        これまで受講費からの数多くの方に受講を<br>
                        サービスを利用いただいてきましたが、
                    </p>
                </div>
                <div class="concept__image">
                    <img src="../assets/images/concept-woman.png" alt="オンラインで学習する女性" class="concept__img">
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================
         FEATUREセクション - 特徴
    ============================================= -->
    <section class="feature" id="feature">
        <div class="feature__inner">
            <div class="section-header section-header--center">
                <span class="section-header__label">FEATURE</span>
                <h2 class="section-header__title">動画学習コースの特徴</h2>
            </div>

            <p class="feature__highlight">
                <span class="feature__highlight-icon">●</span>
                プロ講師の動画レッスン提供で低価格で高品質！
            </p>

            <div class="feature__grid">
                <!-- 特徴01 -->
                <div class="feature__card">
                    <span class="feature__card-number">01</span>
                    <div class="feature__card-icon">
                        <img src="../assets/images/feature-icon-01.png" alt="" aria-hidden="true">
                    </div>
                    <p class="feature__card-text">
                        <strong>発声の基礎</strong>から<br>
                        <strong>表現力</strong>まで<br>
                        幅広く学べる
                    </p>
                </div>

                <!-- 特徴02 -->
                <div class="feature__card">
                    <span class="feature__card-number">02</span>
                    <div class="feature__card-icon">
                        <img src="../assets/images/feature-icon-02.png" alt="" aria-hidden="true">
                    </div>
                    <p class="feature__card-text">
                        いつでも・どこでも<br>
                        <strong>スマホひとつ</strong>で<br>
                        レッスン可能
                    </p>
                </div>

                <!-- 特徴03 -->
                <div class="feature__card">
                    <span class="feature__card-number">03</span>
                    <div class="feature__card-icon">
                        <img src="../assets/images/feature-icon-03.png" alt="" aria-hidden="true">
                    </div>
                    <p class="feature__card-text">
                        <strong>20万円相当</strong>の<br>
                        教材が月額980円で<br>
                        見放題
                    </p>
                </div>
            </div>

            <p class="feature__sub-highlight">
                <span class="feature__sub-highlight-icon">●</span>
                音楽経験初心者の方やボイストレーニングを自分に受けられる！
            </p>

            <div class="feature__grid feature__grid--secondary">
                <!-- 特徴04 -->
                <div class="feature__card feature__card--secondary">
                    <span class="feature__card-number">04</span>
                    <div class="feature__card-content">
                        <div class="feature__card-icon">
                            <img src="../assets/images/feature-icon-04.png" alt="" aria-hidden="true">
                        </div>
                        <p class="feature__card-text">
                            <strong>初心者向け</strong>の<br>
                            教材も充実
                        </p>
                    </div>
                </div>

                <!-- 特徴05 -->
                <div class="feature__card feature__card--secondary">
                    <span class="feature__card-number">05</span>
                    <div class="feature__card-content">
                        <div class="feature__card-icon">
                            <img src="../assets/images/feature-icon-05.png" alt="" aria-hidden="true">
                        </div>
                        <p class="feature__card-text">
                            教材は今後も<br>
                            <strong>随時アップデート</strong>！
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================
         LESSSONセクション - プロ講師による動画レッスン
    ============================================= -->
    <section class="lesson" id="lesson">
        <div class="lesson__inner">
            <div class="section-header section-header--center">
                <span class="section-header__label">LESSON</span>
                <h2 class="section-header__title">
                    <span class="lesson__title-accent">プロ講師</span>による<br>
                    体系化された動画レッスン
                </h2>
            </div>

            <div class="lesson__grid">
                <!-- レッスンカード1 -->
                <div class="lesson__card">
                    <div class="lesson__card-header">
                        <span class="lesson__card-icon">
                            <img src="../assets/images/lesson-icon-voice.png" alt="" aria-hidden="true">
                        </span>
                        <h3 class="lesson__card-title">発声基礎</h3>
                    </div>
                    <p class="lesson__card-desc">※動画教材17本</p>
                    <ul class="lesson__card-list">
                        <li>発声における呼吸法について</li>
                        <li>喉の使い方</li>
                        <li>声の出し方</li>
                        <li>発声における共鳴について</li>
                    </ul>
                </div>

                <!-- レッスンカード2 -->
                <div class="lesson__card">
                    <div class="lesson__card-header">
                        <span class="lesson__card-icon">
                            <img src="../assets/images/lesson-icon-rhythm.png" alt="" aria-hidden="true">
                        </span>
                        <h3 class="lesson__card-title">リズム</h3>
                    </div>
                    <p class="lesson__card-desc">※動画教材5本</p>
                    <ul class="lesson__card-list">
                        <li>リズム感について</li>
                        <li>グルーヴ</li>
                    </ul>
                </div>

                <!-- レッスンカード3 -->
                <div class="lesson__card">
                    <div class="lesson__card-header">
                        <span class="lesson__card-icon">
                            <img src="../assets/images/lesson-icon-music.png" alt="" aria-hidden="true">
                        </span>
                        <h3 class="lesson__card-title">音楽理論</h3>
                    </div>
                    <p class="lesson__card-desc">※動画教材8本</p>
                    <ul class="lesson__card-list">
                        <li>楽譜・コード</li>
                        <li>音程</li>
                        <li>テンポ</li>
                    </ul>
                </div>

                <!-- レッスンカード4 -->
                <div class="lesson__card">
                    <div class="lesson__card-header">
                        <span class="lesson__card-icon">
                            <img src="../assets/images/lesson-icon-practice.png" alt="" aria-hidden="true">
                        </span>
                        <h3 class="lesson__card-title">実践トレーニング</h3>
                    </div>
                    <p class="lesson__card-desc">※動画教材12本</p>
                    <ul class="lesson__card-list">
                        <li>ウォームアップ</li>
                        <li>発声練習</li>
                        <li>表現力トレーニング</li>
                    </ul>
                </div>

                <!-- レッスンカード5 -->
                <div class="lesson__card">
                    <div class="lesson__card-header">
                        <span class="lesson__card-icon">
                            <img src="../assets/images/lesson-icon-exp.png" alt="" aria-hidden="true">
                        </span>
                        <h3 class="lesson__card-title">表現力向上</h3>
                    </div>
                    <p class="lesson__card-desc">※動画教材6本</p>
                    <ul class="lesson__card-list">
                        <li>抑揚・強弱</li>
                        <li>感情表現</li>
                    </ul>
                </div>
            </div>

            <div class="lesson__note">
                <p class="lesson__note-text">
                    <span class="lesson__note-icon">
                        <img src="../assets/images/icon-note.png" alt="" aria-hidden="true">
                    </span>
                    VoiceCamp<br>動画教材より
                </p>
            </div>
        </div>
    </section>

    <!-- ============================================
         PLANセクション - 料金プラン
    ============================================= -->
    <section class="plan" id="plan">
        <div class="plan__inner">
            <div class="section-header section-header--center">
                <span class="section-header__label">PLAN</span>
                <h2 class="section-header__title">料金プラン</h2>
            </div>

            <div class="plan__card">
                <p class="plan__card-lead">
                    <span class="plan__card-lead-deco">＼</span>
                    20万円相当の教材が
                    <span class="plan__card-lead-deco">／</span>
                </p>
                <p class="plan__card-price">
                    <span class="plan__card-price-label">月額</span>
                    <span class="plan__card-price-number">980</span>
                    <span class="plan__card-price-unit">円</span>
                    <span class="plan__card-price-tax">（税込）</span>
                </p>

                <div class="plan__card-includes">
                    <p class="plan__card-includes-title">含まれる内容</p>
                    <ul class="plan__card-includes-list">
                        <li>
                            <span class="plan__card-includes-icon">●</span>
                            全動画教材（発声コース）
                        </li>
                        <li>
                            <span class="plan__card-includes-icon">●</span>
                            発声のテキスト教材
                        </li>
                        <li>
                            <span class="plan__card-includes-icon">●</span>
                            定期的な教材更新
                        </li>
                    </ul>
                </div>

                <div class="plan__card-notice">
                    <p class="plan__card-notice-text">※解約期間の縛りなくで解約OK！</p>
                </div>

                <div class="plan__card-unlimited">
                    <p class="plan__card-unlimited-text">無制限で見放題！</p>
                </div>

                <p class="plan__card-trial">
                    まずは「<strong>14日間の無料体験</strong>」をお試しください！
                </p>
            </div>
        </div>
    </section>

    <!-- ============================================
         CTA セクション - 無料体験
    ============================================= -->
    <section class="cta" id="register">
        <div class="cta__inner">
            <div class="cta__content">
                <h2 class="cta__title">動画学習コースの無料体験はこちらから</h2>
                <p class="cta__description">
                    無料お試し動画視聴からコースを申し込みの方、<br>
                    動画を見て判断されたい方はこちら
                </p>
                <a href="#" class="cta__btn btn btn--secondary">
                    <span class="btn__text">無料登録はこちら</span>
                </a>
            </div>
            <div class="cta__image">
                <img src="../assets/images/cta-phone.png" alt="スマートフォンでVoiceCampを利用するイメージ" class="cta__img">
            </div>
        </div>
    </section>

    <!-- ============================================
         フッター上部 - ブランドセクション
    ============================================= -->
    <section class="brand-footer">
        <div class="brand-footer__inner">
            <p class="brand-footer__catch">
                週1回 手軽に始められる<br>
                <span class="brand-footer__catch-icon">
                    <img src="../assets/images/icon-mic.png" alt="" aria-hidden="true">
                </span>
                <span class="brand-footer__catch-highlight">声</span>のトレーニング
            </p>
            <p class="brand-footer__sub">専門家直伝から学ぶ正統派</p>
            <div class="brand-footer__logo">
                <img src="../assets/images/logo-voicecamp-full.png" alt="VoiceCamp ボイスキャンプ" class="brand-footer__logo-img">
            </div>
            <p class="brand-footer__note">
                運営元：「株式会社〇〇〇〇〇〇〇〇〇〇〇〇」<br>
                所在地：〒000-0000 東京都〇〇区〇〇〇-〇-〇
            </p>
        </div>
    </section>

</main>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>

<#import "template.ftl" as layout>
<@layout.mainLayout active='password' bodyClass='user password'>

    <div class="ape-card">
        <div class="ape-card-header">
            <h2 class="ape-card-title">${msg("changePasswordHtmlTitle")}</h2>
            <p style="margin-top: 0.5rem; color: #64748b; font-size: 0.875rem;">
                Keep your account secure by choosing a strong, unique password.
            </p>
        </div>

        <div class="ape-card-body">
            <form action="${url.passwordUrl}" class="form-horizontal" method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

                <div class="ape-form-group">
                    <label for="password" class="ape-label">${msg("passwordCurrent")}</label>
                    <input type="password" class="ape-input" id="password" name="password" autocomplete="off"/>
                </div>

                <div class="ape-form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div class="ape-form-group" style="margin-bottom: 0;">
                        <label for="password-new" class="ape-label">${msg("passwordNew")}</label>
                        <input type="password" class="ape-input" id="password-new" name="password-new" autocomplete="new-password"/>
                    </div>

                    <div class="ape-form-group" style="margin-bottom: 0;">
                        <label for="password-confirm" class="ape-label">${msg("passwordConfirm")}</label>
                        <input type="password" class="ape-input" id="password-confirm" name="password-confirm" autocomplete="new-password"/>
                    </div>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center;">
                    <button type="submit" class="ape-btn ape-btn-primary" name="submitAction" value="Save">${msg("doSave")}</button>
                    <button type="submit" class="ape-btn" style="background-color: #f1f5f9; color: #475569;" name="submitAction" value="Cancel">${msg("doCancel")}</button>
                </div>
            </form>
        </div>
    </div>

</@layout.mainLayout>

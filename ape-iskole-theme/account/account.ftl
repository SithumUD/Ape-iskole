<#import "template.ftl" as layout>
<@layout.mainLayout active='account' bodyClass='user account'>

    <div class="ape-card">
        <div class="ape-card-header">
            <h2 class="ape-card-title">${msg("editAccountHtmlTitle")}</h2>
            <p style="margin-top: 0.5rem; color: #64748b; font-size: 0.875rem;">
                Manage your personal information and account settings.
            </p>
        </div>

        <div class="ape-card-body">
            <form action="${url.accountUrl}" class="form-horizontal" method="post">
                <input type="hidden" id="stateChecker" name="stateChecker" value="${stateChecker}">

                <#if !realm.registrationEmailAsUsername>
                    <div class="ape-form-group">
                        <label for="username" class="ape-label">${msg("username")} <#if realm.editUsernameAllowed><span class="required">*</span></#if></label>
                        <input type="text" class="ape-input" id="username" name="username" <#if !realm.editUsernameAllowed>disabled="disabled"</#if> value="${(account.username!'')}"/>
                    </div>
                </#if>

                <div class="ape-form-group">
                    <label for="email" class="ape-label">${msg("email")} <span class="required">*</span></label>
                    <input type="text" class="ape-input" id="email" name="email" value="${(account.email!'')}"/>
                </div>

                <div class="ape-form-group">
                    <label for="firstName" class="ape-label">${msg("firstName")} <span class="required">*</span></label>
                    <input type="text" class="ape-input" id="firstName" name="firstName" value="${(account.firstName!'')}"/>
                </div>

                <div class="ape-form-group">
                    <label for="lastName" class="ape-label">${msg("lastName")} <span class="required">*</span></label>
                    <input type="text" class="ape-input" id="lastName" name="lastName" value="${(account.lastName!'')}"/>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center;">
                    <button type="submit" class="ape-btn ape-btn-primary" name="submitAction" value="Save">${msg("doSave")}</button>
                    <button type="submit" class="ape-btn" style="background-color: #f1f5f9; color: #475569;" name="submitAction" value="Cancel">${msg("doCancel")}</button>
                    
                    <#if messagesPerField.existsError('username','email','firstName','lastName')>
                        <span style="color: #ef4444; font-size: 0.875rem; font-weight: 600;">⚠️ Please check the required fields.</span>
                    </#if>
                </div>
            </form>
        </div>
    </div>

</@layout.mainLayout>

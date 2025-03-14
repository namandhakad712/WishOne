# PowerShell script to commit and push changes to GitHub

# Add all changes to staging
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    # Commit changes with a descriptive message
    git commit -m "Update UI with glassmorphic design for login and signup pages"

    # Push changes to the remote repository
    git push origin main

    Write-Host "Changes pushed to GitHub successfully!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit. Working tree is clean." -ForegroundColor Yellow
    
    # Pull latest changes just to be sure we're up to date
    git pull origin main
    
    Write-Host "Repository is up to date with remote." -ForegroundColor Green
} 
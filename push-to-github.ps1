# PowerShell script to commit and push changes to GitHub

# Add all changes to staging
git add .

# Commit changes with a descriptive message
git commit -m "Update ExpandableMenu animation speed and fix avatar generation"

# Push changes to the remote repository
git push

# Display status after push
Write-Host "Changes pushed to GitHub successfully!" -ForegroundColor Green 
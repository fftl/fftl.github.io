cd E:\Project\quartz\content

Get-ChildItem -Recurse -File -Include *.md | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    
    # 최초 커밋 날짜 가져오기 (--reverse로 가장 오래된 커밋)
    $gitDate = git log --reverse --format="%ai" -- $relativePath | Select-Object -First 1
    
    if ($gitDate) {
        $dateTime = [DateTime]::Parse($gitDate)
        $_.LastWriteTime = $dateTime
        Write-Host "✓ $($_.Name) -> $($dateTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Green
    } else {
        Write-Host "× $($_.Name) - Git 이력 없음" -ForegroundColor Yellow
    }
}

Write-Host "`n완료!" -ForegroundColor Cyan
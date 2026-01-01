cd E:\Project\quartz\content

Get-ChildItem -Recurse -File -Include *.md | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # 이미 frontmatter가 있는지 확인
    if ($content -match '^---\s*\r?\n') {
        Write-Host "○ $($_.Name) - 이미 frontmatter 있음" -ForegroundColor Yellow
    } else {
        # 파일 수정 시간을 날짜로 변환
        $date = $_.LastWriteTime.ToString('yyyy-MM-dd')
        
        # Frontmatter 추가
        $newContent = "---`ndate: $date`n---`n`n$content"
        
        # UTF-8 BOM 없이 저장
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($_.FullName, $newContent, $utf8NoBom)
        
        Write-Host "✓ $($_.Name) -> $date" -ForegroundColor Green
    }
}

Write-Host "`n완료! 이제 sync를 실행하세요." -ForegroundColor Cyan
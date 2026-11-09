<?php
/**
 * 公共安全辅助函数（CSRF / 限流 / 输入校验）
 */

if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

/** 生成/获取 CSRF token */
function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/** 校验请求中的 CSRF token（POST 参数 csrf_token 或 X-CSRF-Token 头） */
function csrf_verify(): bool
{
    $sent = $_POST['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    return !empty($_SESSION['csrf_token'])
        && is_string($sent)
        && hash_equals($_SESSION['csrf_token'], $sent);
}

/**
 * 简单限流：按 "动作+会话/IP" 计数，窗口内超过上限返回 false。
 * 例：登录尝试 15 分钟内最多 10 次。
 */
function rate_limit(string $action, int $maxAttempts, int $windowSeconds): bool
{
    $key = 'rl_' . $action;
    $now = time();
    if (!isset($_SESSION[$key]) || $now - ($_SESSION[$key]['start'] ?? 0) > $windowSeconds) {
        $_SESSION[$key] = ['start' => $now, 'count' => 1];
        return true;
    }
    $_SESSION[$key]['count']++;
    return $_SESSION[$key]['count'] <= $maxAttempts;
}

/** 输出 JSON 响应 */
function json_out($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** 要求 POST + CSRF 有效，否则终止 */
function require_post_csrf(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(['ok' => false, 'msg' => '非法操作'], 405);
    }
    if (!csrf_verify()) {
        json_out(['ok' => false, 'msg' => '请求校验失败，请刷新页面重试'], 403);
    }
}

/** 取字符串输入并做长度限制/去除控制字符 */
function clean_input(string $name, int $maxLen = 100): string
{
    $v = $_POST[$name] ?? $_GET[$name] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
    return mb_substr(trim($v), 0, $maxLen);
}

/** 校验正整数 ID */
function clean_id(string $name): ?int
{
    $v = $_POST[$name] ?? $_GET[$name] ?? null;
    if ($v === null || !preg_match('/^\d{1,10}$/', (string)$v)) {
        return null;
    }
    return (int)$v;
}

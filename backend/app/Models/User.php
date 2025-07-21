<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firebase_uid',
        'name',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        // パスワードは使わないので空
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // email_verified_at は使わないので空
    ];

    /**
     * ユーザーは多くの投稿を持つ
     */

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * ユーザーは多くのコメントを持つ
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
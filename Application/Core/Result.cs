using System;

namespace Application.Core;

public class Result<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }

    public static Result<T> Success(T value) => new() {IsSuccess = true, Value = value}; 
    //this syntax call target-typed new, in this case is new instance of Result not new anonymous type
    //syntax of new anonymous type is new { IsSuccess = true, Value = value };

    public static Result<T> Failure(string error, int code) => new() {IsSuccess = false, Error = error, Code = code};

}

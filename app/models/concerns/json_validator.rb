class JsonValidator < ActiveModel::EachValidator

  def validate_each(record, attribute, value)
    begin
      JSON.parse(value)
    rescue JSON::ParseError => err
      record.errors[attribute] << (options[:message] || "is not valid JSON: #{err.message}")
    end
  end

end
